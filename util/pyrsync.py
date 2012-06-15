#!/usr/bin/python

import os, argparse
import subprocess as sp

dry = False

class Bkup(object):
  bkups = []

  def __init__(self, kind):
    self.kind = kind

    self.dst = ''
    self.src = ''

    self.dst_server = ''
    self.src_server = ''

    self.tags = []

    Bkup.bkups.append(self)

  def add_tags(self, *names):
    self.tags = names

  def run(self):
    backup_funcs[self.kind](self)

def run_all():
  for bk in Bkup.bkups:
    bk.run()

def run_tags(names):
  for bk in Bkup.bkups:
    for name in names:
      if name in bk.tags:
        bk.run()
        break # run each bk only once

def mirror_back(bk):
  src = ssh_arg_for(bk.src_server, bk.src)
  dst = ssh_arg_for(bk.dst_server, bk.dst)

  cmd = ['rsync', '-a', '-v']
  cmd.extend([src, dst])
  run_bkup_cmd(cmd)

def incr_back(bk, full_backup = False):
  """
  Create incremental backup stored in a common directory with hard links to prev
  backed up files that haven't changed.  Uses rsync for the dirty work. non-local
  paths (e.g. w/ a server) not supported.
  """
  src = trailing_slash(bk.src)
  prev_dst, dst = incr_dst_paths(bk.dst)
  
  cmd = ['rsync', '-a', '-v']
  if not full_backup:
    cmd.append('--link-dest=' + prev_dst)
  cmd.extend([src, dst])
  run_bkup_cmd(cmd)

def run_bkup_cmd(cmd):
  print 'Running rsync command', cmd
  if dry:
    return

  p = sp.Popen(cmd, stdout = sp.PIPE, stderr = sp.PIPE)
  out, err = p.communicate()

  print '\n'.join(out.splitlines()[-2:])
  if p.returncode != 0:
    print err

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
  
  return prev_dst, next_dst

def last_backup_name(root):
  prev_ext = 0
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

backup_funcs = {}
backup_funcs['mirror'] = mirror_back
backup_funcs['incr'] = incr_back

