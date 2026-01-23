
import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements AfterViewInit {

  @ViewChild('statsSection', { static: false }) statsSection!: ElementRef;
  private hasStarted = false;

  ngAfterViewInit(): void {

    /* ============================= */
    /* SCROLL REVEAL OBSERVER */
    /* ============================= */
    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      {
        threshold: 0.2
      }
    );

    document.querySelectorAll('.reveal').forEach(el => {
      revealObserver.observe(el);
    });

    /* ============================= */
    /* STATS COUNTER OBSERVER */
    /* ============================= */
    const statsObserver = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !this.hasStarted) {
          this.hasStarted = true;
          this.startCounting();
          statsObserver.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    statsObserver.observe(this.statsSection.nativeElement);
  }

  private startCounting(): void {
    const counters =
      this.statsSection.nativeElement.querySelectorAll('h2');

    counters.forEach((counter: HTMLElement) => {
      const target = Number(counter.dataset['target']);
      const suffix = counter.dataset['suffix'] || '';
      let current = 0;

      const increment = Math.ceil(target / 60);

      const update = () => {
        current += increment;

        if (current >= target) {
          counter.innerText = target + suffix;
        } else {
          counter.innerText = current + suffix;
          requestAnimationFrame(update);
        }
      };

      update();
    });
  }
}

