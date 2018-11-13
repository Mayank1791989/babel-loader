/* @flow */
import genHash from './gen-hash';
import fs from 'fs';

export default function genFileContentHash(filepath: string): string {
  return genHash(fs.readFileSync(filepath));
}
