#!/usr/bin/python
import sys, argparse
from pyback.new import mirror, incr
from pyback import run

####################################################################
################ create backup entries below here ##################
####################################################################

bk = incr()
bk.src = '/home/robert/Pictures'
bk.dst = '/media/spare/backups/incr/Pictures'
bk.add_tags('local', 'media')

bk = mirror()
bk.src = '/home/robert/git'
bk.dst = '/media/spare/backups/mirror/git'
bk.add_tags('local')

bk = mirror()
bk.src = '/home/robert/git'
bk.dst = 'family@my1.homeftp.net'
bk.add_tags('offsite')

bk = mirror()
bk.src = '/home/robert/.bitcoin/wallet.dat'
bk.dst = '/media/spare/backups/mirror/bit-wallet'
bk.add_tags('local')

bk = mirror()
bk.src = '/home/robert/esther'
bk.dst = '/media/spare/backups/mirror/esther'
bk.add_tags('local')

####################################################################
################ Don't touch anything below here ###################
####################################################################

if __name__ == '__main__':
  parser = argparse.ArgumentParser(description="Run incremental and mirror backups using rsync")
  parser.add_argument('--dry', dest='dry', action='store_true', default=False, help='build and show backup commands without running them')
  parser.add_argument('tags', metavar='tag', type=str, nargs='*', help='limit backup runs to those in this tag')
  args = parser.parse_args()

  run.dry = args.dry
  if len(args.tags) > 0:
    run.for_tags(args.tags)
  else:
    run.all()
