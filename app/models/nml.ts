interface Resource {
  resource: string
  secure: boolean,
  readonly: boolean
}

export interface Album extends Resource {
  id: string
  title: string
  artwork: Resource
  label: Label
  tracks: Array<Track>,
  category: string
}

interface Label extends Resource {
  description: string
}

export interface Albums extends Resource {
  tracklists: Array<Album>
  name: string,
  currentpage: number,
  pagesize: number,
  totalpages: number
}

export interface Track extends Resource {
  title: string,
  disk: number,
  track: number,
  audio: Resource,
  timing: string,
  duration: string,
  group: string,
  contributors: Array<Contributor>,
  category: string,
  genre: string
}

export interface Contributor extends Resource {
  type: string,
  name: string
}
