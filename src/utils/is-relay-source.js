/* @flow */
export default function isRelaySource(source: string): boolean {
  return /Relay\.QL/u.test(source);
}
