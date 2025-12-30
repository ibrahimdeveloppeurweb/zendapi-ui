import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'CountryFilter'
})
export class CountryFilterPipe implements PipeTransform {
  transform(items: any[], args: string): any {
    let filterBy = args && args !== ' ' ? args.toLocaleLowerCase() : null;
    return items.filter(item => item.nom.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

}
