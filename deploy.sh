#!/bin/bash
set -e

branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

if [ "$branch" != "master" ] ; then
  echo "You must be on the master branch"
  exit 2
fi

grunt
git checkout gh-pages
git --work-tree build add --all

echo "Message: "
read message

git --work-tree build commit -m "$message"
git push origin gh-pages
git symbolic-ref HEAD refs/heads/master && git reset --hard
