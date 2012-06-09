#!/usr/bin/python

import os
import pyrsync

class bkup:
  bkups = []
  def __init__(self, kind, dst, *srcs):
    self.kind = kind
    self.dst = dst
    self.srcs = srcs
    bkups.append(self)

srcs['local'] = bkup('incr', '/media/spare/backups', 'Pictures', 'repos')

def main():
  home = os.getenv('HOME')

# incremental backup of svn repositories
  for bk in bkup.bkups:
    for src in bk.srcs:
      if bk.kind == 'incr':
        pyrsync.backup(os.path.join(home, src), bk.dst)

if __name__ == '__main__':
  main()
