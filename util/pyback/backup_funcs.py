
import os

def mirror(bk):
  src = ssh_arg_for(bk.src_server, bk.src)
  dst = ssh_arg_for(bk.dst_server, bk.dst)

  cmd = ['rsync', '-a', '-v', '--delete']
  cmd.extend([src, dst])
  return cmd

def incremental(bk):
  """
  Create incremental backup stored in a common directory with hard links to prev
  backed up files that haven't changed.  Uses rsync for the dirty work. non-local
  paths (e.g. w/ a server) not supported.
  """
  src = trailing_slash(bk.src)
  prev_dst, dst = incr_dst_paths(bk.dst)
  
  cmd = ['rsync', '-a', '-v']
  if prev_dst != dst:
    cmd.append('--link-dest=' + prev_dst)
  cmd.extend([src, dst])
  return cmd

def ssh_arg_for(serv, path):
  arg = trailing_slash(path)
  if len(serv) > 0:
    arg = '-e ssh ' + serv + ':' + arg
  return arg

def incr_dst_paths(root):
  """
  find last used backup folder extension and generage
  the next backup folder name from it
  """
  name, prev_ext = last_backup_name(root)

  tmp = os.path.join(root, name) + '.'
  prev_dst = tmp + str(prev_ext)
  next_dst = tmp + str(prev_ext + 1)

  if prev_ext < 0:
    return next_dst, next_dst
  return prev_dst, next_dst

def last_backup_name(root):
  prev_ext = -1
  prev_name = 'backup'

  dst_root = os.path.abspath(root)
  dir_items = os.listdir(root)
  for item in dir_items:
    path = os.path.join(root, item)
    base, ext = os.path.splitext(item)

    if not os.path.isdir(path):
      continue
    if len(ext) == 0:
      continue

    if int(ext[1:]) > prev_ext:
      prev_name = base
      prev_ext = int(ext[1:])

  return prev_name, prev_ext

def trailing_slash(arg_src):
  src = arg_src
  if os.path.isdir(src):
    if arg_src[-1] != '/':
      src += '/'
  return src

