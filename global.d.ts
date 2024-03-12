
type Stats = {
    hp: number,
    atk: number,
    def: number,
    spa: number,
    spd: number,
    spe: number
};

declare interface SpeciesData {
    num: number;
    name: string,
    baseStats: Stats;
    types: string[];
    forme?: string;
    evos?: string[];
    [_: string]: any;
}
