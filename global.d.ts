
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
    forme?: string;
    evos?: string[];
    [_: string]: any;
}
