#!/usr/bin/bash
declare -A backs

#################################################################
### add entries to this array for rsync src and dst locations ###
#################################################################

SERV=robert@my1.homeftp.net
SERVDIR=/volume1/homes/robert/backups
LOCALDIR=/media/spare/backups

PICLIB=$HOME/pics/rwc-piclib
backs[picdata-nas]="--ignore-existing $PICLIB -e ssh $SERV:$SERVDIR/"
backs[picmeta-nas]="$PICLIB/metadata -e ssh $SERV:$SERVDIR/rwc-piclib/"
backs[picdata-local]="--ignore-existing $PICLIB $LOCALDIR/"
backs[picmeta-local]="$PICLIB/metadata $LOCALDIR/rwc-piclib/"

backs[git-local]="$HOME/git $LOCALDIR/"

backs[docs-local]="$HOME/docs $LOCALDIR/"
backs[docs-nas]="$HOME/docs $LOCALDIR/"

backs[vids-local]="--ignore-existing $HOME/vids $LOCALDIR/"

############# end custom src-dst backup entries ##################

RSYNC_FLAGS=-av
for var in "$@"
do
  echo "rsync $RSYNC_FLAGS ${backs[$var]}"
  rsync $RSYNC_FLAGS ${backs[$var]}
done

