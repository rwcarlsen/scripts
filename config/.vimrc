set incsearch
set nocompatible
set autoindent
set smartindent
set tabstop=2
set shiftwidth=2
set hidden
set expandtab
set showmatch
set ruler
set number
setlocal textwidth=75
set foldmethod=syntax
syntax on
colorscheme default
highlight Folded ctermbg=0 ctermfg=7*

"golang stuff
set rtp+=$GOROOT/misc/vim
filetype plugin on
filetype plugin indent on

autocmd FileType go setlocal shiftwidth=4 tabstop=4 noexpandtab


