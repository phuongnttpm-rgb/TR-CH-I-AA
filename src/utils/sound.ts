/**
 * Web Audio API synthesizer for gameshow sound effects
 * Zero external audio dependencies - completely offline capable & reliable
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.droneGain) {
      this.droneGain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  // Background tension ambient drone
  public startTensionDrone(intensity: 'low' | 'medium' | 'high' = 'low') {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    this.stopTensionDrone();

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      const freqs = { low: 55, medium: 65, high: 82.4 }; // A1, C2, E2
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freqs[intensity], this.ctx.currentTime);

      // Low pass filter to make it mysterious and deep
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(160, this.ctx.currentTime);

      const targetGain = intensity === 'high' ? 0.08 : 0.04;
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(targetGain, this.ctx.currentTime + 1.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      this.droneOsc = osc;
      this.droneGain = gain;
    } catch {
      // Audio autoplay may need user gesture
    }
  }

  public stopTensionDrone() {
    if (this.droneOsc && this.ctx) {
      try {
        if (this.droneGain) {
          this.droneGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
        }
        setTimeout(() => {
          this.droneOsc?.stop();
          this.droneOsc?.disconnect();
          this.droneOsc = null;
          this.droneGain = null;
        }, 500);
      } catch {
        this.droneOsc = null;
        this.droneGain = null;
      }
    }
  }

  // Button click / answer selection
  public playSelect() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t); // A4
    osc.frequency.exponentialRampToValueAtTime(660, t + 0.12);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  // Dramatic "Chốt đáp án" build-up (tension rising sweep + heartbeat)
  public playFinalAnswerLock() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // Heartbeat thud 1
    this.playHeartbeat(t, 60, 0.25);
    // Heartbeat thud 2
    this.playHeartbeat(t + 0.28, 55, 0.2);

    // Rising suspense chord
    const freqs = [130.81, 164.81, 196.00]; // C-E-G
    freqs.forEach((f) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t);
      osc.frequency.linearRampToValueAtTime(f * 1.05, t + 1.2);

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.3);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + 1.3);
    });
  }

  private playHeartbeat(time: number, freq: number, vol: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(25, time + 0.18);

    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + 0.2);
  }

  // Correct answer fanfare
  public playCorrect(isMilestone: boolean = false) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = isMilestone 
      ? [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50] // Major arpeggio high
      : [392.00, 523.25, 659.25, 783.99]; // G4, C5, E5, G5

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const noteStart = t + idx * 0.09;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteStart);

      gain.gain.setValueAtTime(0.001, noteStart);
      gain.gain.linearRampToValueAtTime(0.25, noteStart + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + (isMilestone ? 1.2 : 0.6));

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(noteStart);
      osc.stop(noteStart + (isMilestone ? 1.2 : 0.6));
    });
  }

  // Wrong answer buzzer / dramatic thud
  public playWrong() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Harsh low buzzer
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc1.frequency.setValueAtTime(110, t); // A2
    osc2.frequency.setValueAtTime(116.54, t); // Bb2 (dissonant semitone)

    osc1.frequency.linearRampToValueAtTime(82.4, t + 0.8);
    osc2.frequency.linearRampToValueAtTime(87.3, t + 0.8);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.9);
    osc2.stop(t + 0.9);
  }

  // Lifeline activation sound
  public playLifeline() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(900, t + 0.35);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.4);
  }

  // Timer tick
  public playTick(isUrgent: boolean = false) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isUrgent ? 880 : 520, t);

    gain.gain.setValueAtTime(isUrgent ? 0.2 : 0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  // Grand Victory 15/15 fanfare
  public playVictory() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const melody = [
      { f: 523.25, d: 0.18 }, // C5
      { f: 523.25, d: 0.18 }, // C5
      { f: 523.25, d: 0.18 }, // C5
      { f: 659.25, d: 0.4 },  // E5
      { f: 783.99, d: 0.4 },  // G5
      { f: 1046.50, d: 0.8 }, // C6
    ];

    let currentT = t;
    melody.forEach((note) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, currentT);

      gain.gain.setValueAtTime(0.01, currentT);
      gain.gain.linearRampToValueAtTime(0.3, currentT + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, currentT + note.d);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(currentT);
      osc.stop(currentT + note.d);

      currentT += note.d * 0.9;
    });
  }
}

export const sounds = new SoundEngine();
