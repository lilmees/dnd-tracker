type SpriteType = 'animals' | 'characters' | 'monsters' | 'items' | 'floors' | 'nature' | 'walls'

type WallSprite =
  | 'fence'
  | 'brick'
  | 'remove'

type NatureSprite =
  | 'oak'
  | 'sandstone'
  | 'stone'
  | 'pebbles'
  | 'mushroom'
  | 'flower-bush'
  | 'bush'
  | 'small-bush'
  | 'flower-cactus'
  | 'cactus'

type FloorSprite =
  | 'brick'
  | 'stone-tile'
  | 'slate-tile'
  | 'wood'
  | 'grass'
  | 'high-grass'
  | 'path'
  | 'dirt'
  | 'sand'
  | 'water'
  | 'lava'
  | 'remove'

type AnimalSprite =
  | 'ant'
  | 'bat'
  | 'bedbug'
  | 'beetle'
  | 'boar'
  | 'cat'
  | 'chicken'
  | 'cockroach'
  | 'cow'
  | 'crab'
  | 'dog'
  | 'duck'
  | 'fox'
  | 'goat'
  | 'monkey'
  | 'pig'
  | 'rat'
  | 'scarab'
  | 'sheep'
  | 'spider'
  | 'tick'
  | 'toad'
  | 'turtle'
  | 'wolf'

type CharacterSprite =
  | 'acolyte'
  | 'angel'
  | 'archon'
  | 'assassin'
  | 'barmaid'
  | 'battlemage'
  | 'blademaster'
  | 'champion'
  | 'cherub'
  | 'child'
  | 'cleric'
  | 'crusader'
  | 'damsel'
  | 'druid'
  | 'drunkard'
  | 'elf-archer'
  | 'elf-enchanter'
  | 'elf-lord'
  | 'elf-wayfarer'
  | 'friar'
  | 'high-priest'
  | 'kid'
  | 'knight'
  | 'nercomancer'
  | 'paladin'
  | 'pixie'
  | 'priest'
  | 'pyromancer'
  | 'ranger'
  | 'rogue'
  | 'shepard'
  | 'slinger'
  | 'soldier'
  | 'sorceress'
  | 'swordsman'
  | 'villager'
  | 'wanderer'

type MonsterSprite =
  | 'abomination'
  | 'ancient-fighter'
  | 'aqua-drake'
  | 'archer'
  | 'balor'
  | 'beholder'
  | 'bestial'
  | 'bladeguard'
  | 'bony-soldier'
  | 'brawler'
  | 'bronze-adult-dragon'
  | 'bronze-wyrmling'
  | 'cadaver'
  | 'copper-adult-dragon'
  | 'copper-wyrmling'
  | 'crawler'
  | 'cyclops'
  | 'demon-eye'
  | 'demon'
  | 'demonling'
  | 'demonspaw'
  | 'deva'
  | 'earth-elemental'
  | 'ettin'
  | 'fire-elemental'
  | 'fles-golem'
  | 'fomorian'
  | 'ghoul'
  | 'gnoll-grunt'
  | 'gnoll-pikeman'
  | 'goblin-occultist'
  | 'goblin-fanatic'
  | 'goblin-archer'
  | 'goblin-wolf-rider'
  | 'goop'
  | 'gouger'
  | 'great-wyvern'
  | 'green-adultdragon'
  | 'green-wyrmling'
  | 'gremlin'
  | 'grimlock'
  | 'grunt'
  | 'harpy'
  | 'ice-golem'
  | 'imp'
  | 'intellect-devourer'
  | 'iron-golem'
  | 'jelly'
  | 'lizardfolk-archer'
  | 'lizardfolk-spearman'
  | 'lizardfolk-gladiator'
  | 'merfolk-aquamancer'
  | 'merfolk-impaler'
  | 'merfolk-mystic'
  | 'merfolk-scout'
  | 'mimic'
  | 'mud-wyvern'
  | 'orc-mage'
  | 'orc-savage'
  | 'orc-shaman'
  | 'orge'
  | 'planetar'
  | 'red-adult-dragon'
  | 'red-wyrmling'
  | 'revenant'
  | 'scoundrel'
  | 'seraph'
  | 'shambler'
  | 'skeleton'
  | 'skull'
  | 'slaad'
  | 'slime'
  | 'spellslinger'
  | 'stalker'
  | 'toxic-hound'
  | 'treant'
  | 'troll'
  | 'viridian-drake'
  | 'watcher'
  | 'water-elemental'
  | 'white-adult-dragon'
  | 'white-wyrmling'
  | 'wisp'
  | 'witch'
  | 'zombie'

type ItemSprite = 'chair' | 'chest' | 'coin' | 'crate' | 'door' | 'key' | 'lever' | 'stairs' | 'table' | 'trap' | 'vase' | 'sign'

type Sprite = NatureSprite | AnimalSprite | CharacterSprite | MonsterSprite | ItemSprite | FloorSprite | WallSprite

type SpriteDirection =
  | 'default'
  | 'l'
  | 'r'
  | 't'
  | 'b'
  | 'lr'
  | 'lt'
  | 'lb'
  | 'rt'
  | 'rb'
  | 'tb'
  | 'ltb'
  | 'rtb'
  | 'lrt'
  | 'lrb'
  | 'lrtb'

interface SpriteMetaData<T> {
  label: string
  value: T
  variations?: number
  size?: {
    width: number
    height: number
  }
  versions?: SpriteDirection[]
}

interface SpriteMap {
  nature: SpriteMetaData<NatureSprite>[]
  animals: SpriteMetaData<AnimalSprite>[]
  characters: SpriteMetaData<CharacterSprite>[]
  monsters: SpriteMetaData<MonsterSprite>[]
  items: SpriteMetaData<ItemSprite>[]
  floors: SpriteMetaData<FloorSprite>[]
  walls: SpriteMetaData<WallSprite>[]
}

interface DraggableSprites extends Omit<SpriteMap, 'walls' | 'floors'> {}

type FabricBrush = 'Pencil' | 'Eraser' | 'Spray'

type FabricShape = 'Rectangle' | 'Cube' | 'Cone' | 'Line' | 'Sphere'

interface SpriteData extends SpriteMetaData<Sprite> {
  url: string
}

interface Coords {
  x: number
  y: number
}

interface AdjacentSprite {
  left: boolean
  right: boolean
  bottom: boolean
  top: boolean
}

type Connection = 'left' | 'right' | 'bottom' | 'top'

interface AOE {
  width?: number
  height?: number
  radius?: number
}

interface AOETooltip {
  hidden: boolean
  top?: string
  left?: string
  aoe?: AOE
}
