#!/usr/bin/env node

import { DictatableConfig } from './types';

export class DictatableConfigApplier {
  constructor(private dictatorPath: string) {}
  apply(config: DictatableConfig) {}
}
