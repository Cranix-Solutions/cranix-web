#!/usr/bin/perl
#

use strict;

my %icons = ();
my $path =  "~/cranix-web/src/app" ;
foreach my $file (`grep -lr ion-icon $path`)  {
	my $content = `cat $file`;
	foreach ( split /<ion-icon/, $content) {
	       	if( / name="(\S+)"/ ) {
			my $b = $1;
			$b =~ s/-outline$//;
			$b =~ s/-sharp$//;
			$icons{$b} = 1;
		}
	}
}
for my $key ( keys %icons ) {
	print $key."\n";
	system("cp ~/ionicons/src/svg/$key.svg ~/cranix-web/src/assets/custom-ion-icons/");;;
	system("cp ~/ionicons/src/svg/$key-outline.svg ~/cranix-web/src/assets/custom-ion-icons/");;;
	system("cp ~/ionicons/src/svg/$key-sharp.svg ~/cranix-web/src/assets/custom-ion-icons/");;;
}
