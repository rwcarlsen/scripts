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

" turn off tabs-to-spaces for Go files.
autocmd FileType go setlocal shiftwidth=4 tabstop=4 noexpandtab

" open header and implementation file in vertical split
command -nargs=1 -complete=file Dop tabe `=fnamemodify(<f-args>, ":r").".cc"` | vs `=fnamemodify("<args>", ":r").".h"`

au BufNewFile,BufRead Tupfile,*.tup setf tup

"""""""""""""""""""""""""""""""""""""""""""""
""""""""""cyclus c++ formatting code"""""""""
"""""""""""""""""""""""""""""""""""""""""""""

command Gfmt execute "silent! %!astyle" | execute "silent %s/^\\(public:\\|private:\\|protected:\\)/ \\1/e" | execute "silent %s/{\\n *}/{ }/e"

" Detect if the current file type is a C-like language.
au BufNewFile,BufRead c,cpp,objc,*.mm,*.hpp call SetupForCLang()

" Configuration for C-like languages.
function! SetupForCLang()
    " Highlight lines longer than 80 characters.
    au BufWinEnter * let w:m2=matchadd('ErrorMsg', '\%>80v.\+', -1)
    " Alternately, uncomment these lines to wrap at 80 characters.
    " setlocal textwidth=80
    " setlocal wrap

    " Use 2 spaces for indentation.
    setlocal shiftwidth=2
    setlocal tabstop=2
    setlocal softtabstop=2
    setlocal expandtab

    " Configure auto-indentation formatting.
    setlocal cindent
    setlocal cinoptions=h1,l1,g1,t0,i4,+4,(0,w1,W4
    setlocal indentexpr=GoogleCppIndent()
    let b:undo_indent = "setl sw< ts< sts< et< tw< wrap< cin< cino< inde<"

    " Uncomment these lines to map F5 to the CEF style checker. Change the path to match your system.
    " map! <F5> <Esc>:!python ~/code/chromium/src/cef/tools/check_style.py %:p 2> lint.out<CR>:cfile lint.out<CR>:silent !rm lint.out<CR>:redraw!<CR>:cc<CR>
    " map  <F5> <Esc>:!python ~/code/chromium/src/cef/tools/check_style.py %:p 2> lint.out<CR>:cfile lint.out<CR>:silent !rm lint.out<CR>:redraw!<CR>:cc<CR>
endfunction

" From https://github.com/vim-scripts/google.vim/blob/master/indent/google.vim
function! GoogleCppIndent()
    let l:cline_num = line('.')

    let l:orig_indent = cindent(l:cline_num)

    if l:orig_indent == 0 | return 0 | endif

    let l:pline_num = prevnonblank(l:cline_num - 1)
    let l:pline = getline(l:pline_num)
    if l:pline =~# '^\s*template' | return l:pline_indent | endif

    " TODO: I don't know to correct it:
    " namespace test {
    " void
    " ....<-- invalid cindent pos
    "
    " void test() {
    " }
    "
    " void
    " <-- cindent pos
    if l:orig_indent != &shiftwidth | return l:orig_indent | endif

    let l:in_comment = 0
    let l:pline_num = prevnonblank(l:cline_num - 1)
    while l:pline_num > -1
        let l:pline = getline(l:pline_num)
        let l:pline_indent = indent(l:pline_num)

        if l:in_comment == 0 && l:pline =~ '^.\{-}\(/\*.\{-}\)\@<!\*/'
            let l:in_comment = 1
        elseif l:in_comment == 1
            if l:pline =~ '/\*\(.\{-}\*/\)\@!'
                let l:in_comment = 0
            endif
        elseif l:pline_indent == 0
            if l:pline !~# '\(#define\)\|\(^\s*//\)\|\(^\s*{\)'
                if l:pline =~# '^\s*namespace.*'
                    return 0
                else
                    return l:orig_indent
                endif
            elseif l:pline =~# '\\$'
                return l:orig_indent
            endif
        else
            return l:orig_indent
        endif

        let l:pline_num = prevnonblank(l:pline_num - 1)
    endwhile

    return l:orig_indent
endfunction
