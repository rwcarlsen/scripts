#!/usr/bin/python
import pyrsync, sys, argparse

####################################################################
################ create backup entries below here ##################
####################################################################

bk = pyrsync.Bkup('incr')
bk.dst = '/media/spare/backups/incr/Pictures'
bk.src = '/home/robert/Pictures'
bk.addtags('local', 'media')

bk = pyrsync.Bkup('incr')
bk.src = '/home/robert/repos'
bk.dst = '/media/spare/backups/incr/repos'
bk.addtags('local', 'crit')

bk = pyrsync.Bkup('mirror')
bk.src = '/home/robert/git'
bk.dst = '/media/spare/backups/mirror/git'
bk.addtags('local')

bk = pyrsync.Bkup('mirror')
bk.src = '/home/robert/.bitcoin/wallet.dat'
bk.dst = '/media/spare/backups/mirror/bit-wallet'
bk.addtags('local', 'crit')

bk = pyrsync.Bkup('mirror')
bk.src = '/home/robert/repos'
bk.dst = '/Volumes/Desktops/Robert/backups/repos'
bk.dst_server = 'family@my1.homeftp.net'
bk.addtags('offsite')

####################################################################
################ Don't touch anything below here ###################
####################################################################

if __name__ == '__main__':
  parser = argparse.ArgumentParser(description="Run incremental and mirror backups using rsync")
  parser.add_argument('--dry', dest='dry', action='store_true', default=False, help='build and show backup commands without running them')
  parser.add_argument('tags', metavar='tag', type=str, nargs='*', help='limit backup runs to those in this tag')
  args = parser.parse_args()

  pyrsync.dry = args.dry

  if len(args.tags) > 0:
    pyrsync.run_tags(args.tags)
  else:
    pyrsync.run_all()
