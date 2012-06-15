#!/usr/bin/python

import backup_funcs as bfunc

class Bkup(object):
  bkups = []

  def __init__(self, func):
    self.dst = ''
    self.src = ''
    self.dst_server = ''
    self.src_server = ''
    self._func = func

    self.tags = []

    Bkup.bkups.append(self)

  def add_tags(self, *names):
    self.tags = names

def mirror():
"""factory for creating a mirror backup instruction"""
  return Bkup(bfunc.mirror)

def incr():
"""factory for creating an incremental backup instruction"""
  return Bkup(bfunc.incremental)

