# MacOS: išjungia ._ failų kūrimą kai naudojamas node, npx ar cp
export COPYFILE_DISABLE=1

alias node="COPYFILE_DISABLE=1 node"
alias npx="COPYFILE_DISABLE=1 npx"
alias cp="COPYFILE_DISABLE=1 cp"
alias mv="COPYFILE_DISABLE=1 mv"
alias rsync="COPYFILE_DISABLE=1 rsync"

# Optional: visada išsivalyti Apple šiukšles
alias cleanmac="find . -name '._*' -delete && find . -name '.DS_Store' -delete"
