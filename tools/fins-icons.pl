#!/usr/bin/perl
#

use strict;

my $path =  "~/cranix-web/src/app" ;
foreach my $file (`grep -lr ion-icon $path`)  {
	my $content = `cat $file`;
	foreach ( split /<ion-icon/, $content) {
	       	if( / name="(\S+)"/ ) {
			print "$1\n";
		} else {
			print "###############################\n";
			print $_;
		}
	}
}
