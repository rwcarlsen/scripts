
SERV=robert@my1.homeftp.net
DSTHOME=/volume1/homes/robert
DST=$DSTHOME/backups/rwc-piclib
FLAGS=-av

rsync $FLAGS --ignore-existing ~/Pictures/rwc-piclib/ -e ssh $SERV:$DST
rsync $FLAGS ~/Pictures/rwc-piclib/metadata/ -e ssh $SERV:$DST/metadata
