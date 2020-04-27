#!/usr/bin/env node

import { DictatableConfig } from './types';

export class DictatableConfigVerifier {
  constructor(private dictatorPath: string) {}
  verify(config: DictatableConfig): boolean {
    return false;
  }
}
