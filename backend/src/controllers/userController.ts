import { User } from '#models';
import { adminLog } from '#utils';
import type {
  UserDTO,
  UserInputDTO,
  UserUpdateInputDTO,
  UserUpdateDTO,
  ChangePasswordInputDTO,
} from '#schemas';
import type { MessageResponse } from '#types';
import type { RequestHandler } from 'express';
import bcrypt from 'bcrypt';

export const createUser: RequestHandler<unknown, UserDTO | MessageResponse, UserInputDTO> = async (
  req,
  res
) => {
  const { name, email, password, roles } = req.body;

  const exists = await User.exists({ email });
  if (exists) {
    return res.status(409).json({ message: `User with email: ${email} already exists!` });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hash, roles });
  try {
    // attempt to resolve actor email for nicer logs
    let actorLabel = req.userId || '<anon>';
    try {
      if (req.userId) {
        const actorUser = await User.findById(req.userId).select('email');
        if (actorUser?.email) actorLabel = `${actorUser.email}(${req.userId})`;
      }
    } catch (e) {
      // ignore
    }
    adminLog(
      '[ADMIN:CREATE_USER] actor=%s target=%s targetRoles=%s ip=%s',
      actorLabel,
      email,
      JSON.stringify(roles),
      req.ip
    );
  } catch (err) {
    console.error('[UserController] failed to write admin log for createUser', err);
  }
  res.status(201).json({ id: user._id.toString(), name, email, roles } as UserDTO);
};

export const getAllUsers: RequestHandler<unknown, UserDTO[], unknown> = async (req, res) => {
  const users = await User.find().select('-password');
  res.status(200).json(
    users.map((user) => {
      const lastActivity = user.streaks?.lastActivityDate ?? user.updatedAt ?? user.createdAt;
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        roles: user.roles,
        lastActivity: lastActivity ? lastActivity.toISOString() : null,
      };
    })
  );
};

export const getUserById: RequestHandler<
  { id: string },
  UserDTO | MessageResponse,
  unknown
> = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select('-password');
  if (!user) {
    return res.status(404).json({ message: `No user with id: ${id} found!` });
  }
  res.status(200).json({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    roles: user.roles,
  } as UserDTO);
};

export const updateUser: RequestHandler<
  { id: string },
  UserDTO | MessageResponse,
  UserUpdateInputDTO
> = async (req, res) => {
  const { id } = req.params;
  const { name, email, roles } = req.body;
  const user = await User.findByIdAndUpdate(id, { name, email, roles }, { new: true }).select(
    '-password'
  );
  if (!user) {
    return res.status(404).json({ message: `No user with id: ${id} found!` });
  }
  try {
    let actorLabel = req.userId || '<anon>';
    try {
      if (req.userId) {
        const actorUser = await User.findById(req.userId).select('email');
        if (actorUser?.email) actorLabel = `${actorUser.email}(${req.userId})`;
      }
    } catch (e) {
      // ignore
    }
    adminLog(
      '[ADMIN:UPDATE_USER] actor=%s target=%s targetRoles=%s ip=%s',
      actorLabel,
      id,
      JSON.stringify(roles),
      req.ip
    );
  } catch (err) {
    console.error('[UserController] failed to write admin log for updateUser', err);
  }
  res.status(200).json({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    roles: user.roles,
  } as UserDTO);
};

export const changeUserPassword: RequestHandler<
  { id: string },
  MessageResponse,
  ChangePasswordInputDTO
> = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(id).select('+password');

  if (!user) {
    throw new Error('User not found', { cause: { status: 404 } });
  }

  const ok = await bcrypt.compare(currentPassword, user.password);

  if (!ok) {
    throw new Error('Invalid credentials', { cause: { status: 400 } });
  }

  const hash = await bcrypt.hash(newPassword, 10);
  user.password = hash;
  await user.save();

  res.clearCookie('accessToken');
  res.json({ message: 'password updated, relogin' });
};

export const deleteUser: RequestHandler<{ id: string }, MessageResponse, unknown> = async (
  req,
  res
) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return res.status(404).json({ message: `No user with id: ${id} found!` });
  }
  try {
    let actorLabel = req.userId || '<anon>';
    try {
      if (req.userId) {
        const actorUser = await User.findById(req.userId).select('email');
        if (actorUser?.email) actorLabel = `${actorUser.email}(${req.userId})`;
      }
    } catch (e) {
      // ignore
    }
    adminLog(
      '[ADMIN:DELETE_USER] actor=%s targetId=%s targetEmail=%s ip=%s',
      actorLabel,
      id,
      user.email,
      req.ip
    );
  } catch (err) {
    console.error('[UserController] failed to write admin log for deleteUser', err);
  }
  res.status(200).json({ message: 'User deleted successfully' });
};
