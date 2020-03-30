import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { LicenseManager }  from "@ag-grid-enterprise/core";
import { environment } from './environments/environment';

LicenseManager.setLicenseKey("For_Trialing_ag-Grid_Only-Not_For_Real_Development_Or_Production_Projects-Valid_Until-30_May_2020_[v2]_MTU5MDc5MzIwMDAwMA==24fe333fb52c9fa7c75155ac14eb8e91");

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
