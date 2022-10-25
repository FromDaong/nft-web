export class Profiler {
  timers: Array<{ id: string; time: Array<number> }> = [];
  splits: Array<string> = [];
  meta: {
    id: string;
    duration: string;
    splits: {
      best: string;
      worst: string;
      all: Array<string>;
    };
  };

  findId(id: string): { id: string; time: Array<number> } {
    return this.timers.find((t) => t.id === id);
  }

  start(id: string) {
    const current = {
      id,
      time: [Date.now()],
    };

    this.timers.push(current);
  }

  done(id: string) {
    const current = this.findId(id);
    const end_time = current.time[current.time.length - 1];
    const duration = end_time - current.time[0];

    const all = current.time.slice(1).map(function (n, i) {
      return n - current.time[i];
    });

    const [best, worst] = Profiler.calculateBestAndWorstAdj(current.time);
    this.meta = {
      id,
      duration: `${duration}ms`,
      splits: {
        best: `${best}ms`,
        worst: `${worst}ms`,
        all: all.map((a) => `${a}ms`),
      },
    };
  }

  reset(id: string) {
    this.timers = this.timers.filter((item) => item.id !== id);
  }

  split(id: string) {
    const c = this.findId(id);
    c.time.push(Date.now());
    this.timers[this.timers.indexOf(c)] = c;
  }

  static calculateBestAndWorstAdj(arr: Array<number>) {
    let minElement = arr[0];
    let maxDiff = arr[1] - arr[0];
    let minDiff = arr[1] - arr[0];

    for (let i = 1; i < arr.length; i++) {
      if (arr[i] - minElement > maxDiff) {
        maxDiff = arr[i] - minElement;
      }
      if (arr[i] < minElement) {
        minElement = arr[i];
      }
    }

    for (let i = 1; i < arr.length; i++) {
      if (arr[i] - minElement < maxDiff) {
        minDiff = arr[i] - minElement;
      }
      if (arr[i] > minElement) {
        minElement = arr[i];
      }
    }

    return [maxDiff, minDiff];
  }
}
