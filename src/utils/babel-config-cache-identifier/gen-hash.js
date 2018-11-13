/* @flow */
import revHash from 'rev-hash';

export default function genHash(str: string) {
  return revHash(str);
}
