
/**
 * TextScramble logic inspired by Justin Windle
 * Adapted for 2.5s deliberate 'decode' effect with hacking + Greek characters
 */
export class TextScramble {
  el: HTMLElement;
  chars: string;
  queue: any[];
  frame: number;
  frameRequest: number;
  resolve: (value: unknown) => void;

  constructor(el: HTMLElement) {
    this.el = el;
    // Hacking symbols + Greek characters
    this.chars = '!<>-_\\/[]{}—=+*^?#αβγδεζηθικλμνξοπρστυφχψω';
    this.update = this.update.bind(this);
    this.queue = [];
    this.frame = 0;
    this.frameRequest = 0;
    this.resolve = () => {};
  }

  setText(newText: string) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      // Slower, more deliberate timing for 2-3s effect
      const start = Math.floor(Math.random() * 80);
      const end = start + Math.floor(Math.random() * 120);
      this.queue.push({ from, to, start, end, char: '' });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        // Using a span with class 'dud' for visual depth
        output += `<span class="opacity-40 font-mono text-highlight-500/60">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve(null);
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}
