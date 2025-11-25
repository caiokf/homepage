export class Ring {
  constructor(private _name: string, private _order: number) {}

  get name(): string {
    return this._name;
  }

  get order(): number {
    return this._order;
  }
}
