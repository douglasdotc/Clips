import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  // To store the sorting order
  // 1: decending order (new upload first)
  // 2: ascending order
  videoOrder = '1'

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Subscribe to changes from the route parameters
    // when the component is initialized. No need to unsubscribe
    // the Observable since Angular will automatically unsubscribe from the
    // Observable when the component is destroyed, which happens when ther user
    // navigate to a different page.
    this.route.queryParamMap.subscribe((params: Params) => {
      this.videoOrder = params.get('sort') === '2' ? params.get('sort') : '1'
    })
  }

  sort(event: Event) {
    // Get the value from event target in the selected element
    const { value } = (event.target as HTMLSelectElement)

    // Place the value in the url route as a query parameter:
    // --> /manage?sort=${value}
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value
      }
    })
  }
}
