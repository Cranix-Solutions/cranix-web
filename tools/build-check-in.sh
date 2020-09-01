#!/bin/bash
REPO="/home/OSC/home:varkoly:CRANIX-4-2/cranix-web"
HERE=$( pwd )
git status

echo -n "Can we build y/n "; read b
if [ $b != "y" ]; then
	exit
fi
cp src/app/services/utils.service.ts-notest src/app/services/utils.service.ts
ionic build --prod
echo -n "Can we checkin y/n "; read b
if [ "${b}" != "y" ]; then
	exit
fi
cp src/index.html-prod www/index.htmlcd
cd www
tar cjf $REPO/cranix-web.tar.bz2 *
xterm -e "git log --raw" &
cd ${REPO}
osc vc
osc ci
cd ${HERE}
cp src/app/services/utils.service.ts-test src/app/services/utils.service.ts
