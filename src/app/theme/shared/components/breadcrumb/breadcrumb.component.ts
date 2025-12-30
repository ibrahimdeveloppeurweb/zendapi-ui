import {Component, Input, OnInit} from '@angular/core';
import {NavigationItem} from '@layout/admin/navigation/navigation';
import {Router, NavigationEnd} from '@angular/router';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  @Input() type: string;
  extraItems = [
    {
      id: 'extra',
      title: 'EXTRA',
      type: 'group',
      icon: 'feather icon-monitor',
      children: [
        {
          id: 'ticket',
          title: 'Ticket',
          type: 'collapse',
          icon: 'fas fa-ticket-alt',
          children: [
            { id: 'ticket', title: 'Ticket', type: 'item', url: '/admin/ticket', breadcrumbs: true },
            { id: 'ticket', title: 'Configuration', type: 'item', url: '/admin/ticket/configuration', breadcrumbs: true },
            { id: 'ticket', title: 'Details', type: 'item', url: '/admin/ticket/show', breadcrumbs: true },
          ]
        },
      ]
    }
  ];

  public navigation: any;
  public url: any;
  breadcrumbList: Array<any> = [];
  public navigationList: Array<any> = [];

  constructor(private route: Router, public nav: NavigationItem, private titleService: Title) {
    this.navigation = this.nav.get();
    this.type = 'theme2';
    this.setBreadcrumb();
  }

  ngOnInit() {// Écoutez les changements de navigation
    this.route.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        let routerUrl: string;
        routerUrl = this.route.url;
        this.url = this.route.url;
        if (routerUrl && typeof routerUrl === 'string') {
          // Retirer la partie après le mot-clé spécifique (e.g., 'show')
          routerUrl = this.removeQueryParams(routerUrl, 'show');
          this.filterNavigation(routerUrl);

        }
      }
    });
  }

  // Méthode pour retirer la partie de l'URL après un mot-clé spécifique
  removeQueryParams(url: string, keyword: string): string {
    const regex = new RegExp(`/${keyword}(\\/.*)?$`);
    return url.replace(regex, `/${keyword}`);
  }

  setBreadcrumb() {
    let routerUrl: string;
    this.route.events.subscribe((router: any) => {
      routerUrl = router.urlAfterRedirects;
      if (routerUrl && typeof routerUrl === 'string') {
        this.breadcrumbList.length = 0;
        let activeLink = router.url;
        this.url = router.url;
        // Retirer la partie après le mot-clé spécifique (e.g., 'show')
        activeLink = this.removeQueryParams(activeLink, 'show');
        this.filterNavigation(activeLink);
      }
    });
  }

  filterNavigation(activeLink) {
    let result = [];
    let title = 'Accueil';
    let isExtra = false
    this.navigation.forEach((a) => {
      if (a.type === 'item' && 'url' in a && a.url === activeLink) {
        isExtra = false
        result = [
          {
            url: ('url' in a) ? a.url : false,
            title: a.title,
            breadcrumbs: ('breadcrumbs' in a) ? a.breadcrumbs : true,
            type: a.type
          }
        ];
        title = a.title;
      } else {
        if (a.type === 'group' && 'children' in a) {
          isExtra = false
          a.children.forEach((b) => {
            if (b.type === 'item' && 'url' in b && b.url === activeLink) {
              isExtra = false
              result = [
                {
                  url: ('url' in b) ? b.url : false,
                  title: b.title,
                  breadcrumbs: ('breadcrumbs' in b) ? b.breadcrumbs : true,
                  type: b.type
                }
              ];
              title = b.title;
            } else {
              if (b.type === 'collapse' && 'children' in b) {
                isExtra = false
                b.children.forEach((c) => {
                  if (c.type === 'item' && 'url' in c && c.url === activeLink) {
                    isExtra = false
                    result = [
                      {
                        url: ('url' in b) ? b.url : false,
                        title: b.title,
                        breadcrumbs: ('breadcrumbs' in b) ? b.breadcrumbs : true,
                        type: b.type
                      },
                      {
                        url: ('url' in c) ? c.url : false,
                        title: c.title,
                        breadcrumbs: ('breadcrumbs' in c) ? c.breadcrumbs : true,
                        type: c.type
                      }
                    ];
                    title = c.title;
                  } else {
                    if (c.type === 'collapse' && 'children' in c) {
                      isExtra = false
                      c.children.forEach((d) => {
                        if (d.type === 'item' && 'url' in d && d.url === activeLink) {
                          isExtra = false
                          result = [
                            {
                              url: ('url' in b) ? b.url : false,
                              title: b.title,
                              breadcrumbs: ('breadcrumbs' in b) ? b.breadcrumbs : true,
                              type: b.type
                            },
                            {
                              url: ('url' in c) ? c.url : false,
                              title: c.title,
                              breadcrumbs: ('breadcrumbs' in c) ? c.breadcrumbs : true,
                              type: c.type
                            },
                            {
                              url: ('url' in d) ? d.url : false,
                              title: d.title,
                              breadcrumbs: ('breadcrumbs' in c) ? d.breadcrumbs : true,
                              type: d.type
                            }
                          ];
                          title = d.title;
                        } else{
                          isExtra = true
                        }
                      });
                    } else{
                      isExtra = true
                    }
                  }
                });
              } else{
                isExtra = true
              }
            }
          });
        } else{
          isExtra = true
        }
      }
    });
    if(isExtra && this.extraItems.length > 0){
      this.extraItems.forEach((a: any) => {
        if (a.type === 'item' && 'url' in a && a.url === activeLink) {
          result = [
            {
              url: this.url,
              title: a.title,
              breadcrumbs: ('breadcrumbs' in a) ? a.breadcrumbs : true,
              type: a.type
            }
          ];
          title = a.title;
        } else {
          if (a.type === 'group' && 'children' in a) {
            a.children.forEach((b) => {
              if (b.type === 'item' && 'url' in b && b.url === activeLink) {
                result = [
                  {
                    url: this.url,
                    title: b.title,
                    breadcrumbs: ('breadcrumbs' in b) ? b.breadcrumbs : true,
                    type: b.type
                  }
                ];
                title = b.title;
              } else {
                if (b.type === 'collapse' && 'children' in b) {
                  b.children.forEach((c) => {
                    if (c.type === 'item' && 'url' in c && c.url === activeLink) {
                      result = [
                        {
                          url: this.url,
                          title: b.title,
                          breadcrumbs: ('breadcrumbs' in b) ? b.breadcrumbs : true,
                          type: b.type
                        },
                        {
                          url: this.url,
                          title: c.title,
                          breadcrumbs: ('breadcrumbs' in c) ? c.breadcrumbs : true,
                          type: c.type
                        }
                      ];
                      title = c.title;
                    } else {
                      if (c.type === 'collapse' && 'children' in c) {
                        c.children.forEach((d) => {
                          if (d.type === 'item' && 'url' in d && d.url === activeLink) {
                            result = [
                              {
                                url: this.url,
                                title: b.title,
                                breadcrumbs: ('breadcrumbs' in b) ? b.breadcrumbs : true,
                                type: b.type
                              },
                              {
                                url: this.url,
                                title: c.title,
                                breadcrumbs: ('breadcrumbs' in c) ? c.breadcrumbs : true,
                                type: c.type
                              },
                              {
                                url: this.url,
                                title: d.title,
                                breadcrumbs: ('breadcrumbs' in c) ? d.breadcrumbs : true,
                                type: d.type
                              }
                            ];
                            title = d.title;
                          }
                        });
                      }
                    }
                  });
                }
              }
            });
          }
        }
      });

    }
    
    this.navigationList = result;
    this.titleService.setTitle(title + ' - Gestion immobilière');
  }
  
}
