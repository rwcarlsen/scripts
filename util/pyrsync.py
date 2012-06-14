#!/usr/bin/python

import os, argparse
import subprocess as sp

class const:
  dry = False

def dry_run_all():
  const.dry = True
  run_all()
  const.dry = False

def run_all():
  for bk in Bkup.bkups:
    bk.run()

def run_groups(names):
  for bk in Bkup.bkups:
    for name in names:
      if name in bk.groups:
        bk.run()
        break # run each bk only once

def mirror_back(bk, src):
  src = ssh_arg_for(bk.srcserv, src)
  dst = ssh_arg_for(bk.dstserv, bk.dst)

  cmd = ['rsync', '-a', '-v']
  cmd.append(src)
  cmd.append(dst)

  run_bkup_cmd(cmd)

def incr_back(bk, src, full_backup = False):
  """
  Create incremental backup stored in a common directory with hard links to prev
  backed up files that haven't changed.  Uses rsync for the dirty work. non-local
  paths (e.g. w/ a server) not supported.
  """
  src = trailing_slash(src)
  prev_dst, dst = incr_dst_paths(bk.dst)
  
  # build rsync command
  cmd = ['rsync', '-a', '-v']
  if not full_backup:
    cmd.append('--link-dest=' + prev_dst)
  cmd.append(src)
  cmd.append(dst)

  run_bkup_cmd(cmd)

def run_bkup_cmd(cmd):
  print 'Running rsync command', cmd
  if not const.dry:
    sp.call(cmd)

class Bkup:
  bkups = []
  funcs = {}
  funcs['mirror'] = mirror_back
  funcs['incr'] = incr_back

  def __init__(self, kind, dst, *srcs):
    self.kind = kind
    self.dst = dst
    self.srcs = list(srcs)

    self.dstserv = ''
    self.srcserv = ''
    self.groups = []

    Bkup.bkups.append(self)

  def addgroups(self, *names):
    self.groups = names

  def addsrc(self, src):
    self.srcs.append(src)

  def srcssh(self, serv):
    self.srcserv = serv

  def dstssh(self, serv):
    self.dstserv = serv

  def run(self):
    for src in self.srcs:
      Bkup.funcs[self.kind](self, src)

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
  name, prev_ext = prev_backup_name(root)

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
      prev_ext = int(ext[1:])
      prev_name = base

def trailing_slash(arg_src):
  src = arg_src
  if arg_src[-1] != '/':
    src += '/'
  return src

