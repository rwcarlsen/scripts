#!/usr/bin/python

import pyrsync

bk = pyrsync.Bkup('incr', '/media/spare/backups/Pictures')
bk.addsrc('/home/robert/Pictures')

bk = pyrsync.Bkup('incr', '/media/spare/backups/repos')
bk.addsrc('/home/robert/repos')

bk = pyrsync.Bkup('mirror', '/media/spare/backups')
bk.dstssh('family@my1.homeftp.net')
bk.addsrc('/home/robert/repos')

if __name__ == '__main__':
  pyrsync.run_all()
  #pyrsync.dry_run_all()
