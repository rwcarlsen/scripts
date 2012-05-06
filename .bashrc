# set environment path as desired, etc.
PATH=$PATH:$HOME/myscripts:$HOME/go/bin
export PATH

GOPATH=$HOME/gopath
GOROOT=$HOME/go
export GOROOT
export GOPATH

# call shell scripts
sh $HOME/myscripts/myconfig.sh

#set aliases
alias ack='ack-grep'

