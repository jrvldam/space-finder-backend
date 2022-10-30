export class MissingFieldError extends Error { }

export function validateAsSpaceEntry(arg: unknown): void | never {
  if (typeof arg !== 'object' || arg === null) {
    throw new MissingFieldError('Space type expected')
  }

  if (!('spaceId' in arg)) {
    throw new MissingFieldError('Value for spaceId is required!')
  }

  if (!('name' in arg)) {
    throw new MissingFieldError('Value for name is required!')
  }

  if (!('location' in arg)) {
    throw new MissingFieldError('Value for location is required!')
  }
}
