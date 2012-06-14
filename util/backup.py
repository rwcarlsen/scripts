#!/usr/bin/python
import pyrsync

bk = pyrsync.Bkup('incr', '/media/spare/backups/incr/Pictures')
bk.addsrc('/home/robert/Pictures')
bk.addgroups('local', 'media')

bk = pyrsync.Bkup('incr', '/media/spare/backups/incr/repos')
bk.addsrc('/home/robert/repos')
bk.addgroups('local', 'crit')

bk = pyrsync.Bkup('mirror', '/media/spare/backups/mirror/git')
bk.addsrc('/home/robert/git')
bk.addgroups('local')

bk = pyrsync.Bkup('mirror', '/media/spare/backups/mirror/bit-wallet')
bk.addsrc('/home/robert/.bitcoin/wallet.dat')
bk.addgroups('local', 'crit')

bk = pyrsync.Bkup('mirror', '/Volumes/Desktops/Robert/backups/repos')
bk.dstssh('family@my1.homeftp.net')
bk.addsrc('/home/robert/repos')
bk.addgroups('offsite')

if __name__ == '__main__':
  if len(sys.argv) > 1:
    pyrsync.run_groups(sys.argv[1:])
  else:
    pyrsync.run_all()
