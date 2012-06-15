#!/usr/bin/python
import pyrsync, sys, argparse

####################################################################
################ create backup entries here ########################
####################################################################

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

####################################################################
################ Don't tough anything below here ###################
####################################################################

if __name__ == '__main__':
  parser = argparse.ArgumentParser(description="Run incremental and mirror backups using rsync")
  parser.add_argument('--dry', dest='dry', action='store_true', default=False, help='build and show backup commands without running them')
  parser.add_argument('groups', metavar='group', type=str, nargs='*', help='limit backup runs to those in this group')
  args = parser.parse_args()

  pyrsync.dry = args.dry

  if len(args.groups) > 0:
    pyrsync.run_groups(args.groups)
  else:
    pyrsync.run_all()
