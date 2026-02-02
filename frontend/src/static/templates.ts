import { TNewsForm } from "src/forms/TNewsForm"
import { FormTColumn, FormTFeature, TReleaseForm } from "src/forms/TReleaseForm"
import { TTagForm } from "src/forms/TTagForm"
import { TTeaserForm } from "src/forms/TTeaserForm"
import { FormTMediaFile } from "src/models/FormTMediaFile"
import { TAttribute } from "src/models/TAttribute"
import { TColumn } from "src/models/TColumn"
import { TFeature } from "src/models/TFeature"
import { TProperty } from "src/models/TProperty"
import { FormTSerie, TSerie } from "src/models/TSerie"
import { TTag } from "src/models/TTag"
const FORM_IMAGE = () => {
    return {
        id: Date.now() + Math.floor(Math.random() * 10),
        fileUrl: '',
        title: '',
        mediaType: 'image',
        description: '',
        fileFormat: '',
        fileSize: 0,
        isExisting: false,
        preview: '',
    } as FormTMediaFile;
}

export const COLUMN_TEMPLATE: TColumn = {
    id: Date.now() + Math.floor(Math.random() * 10),
    body: '',
    title: '',
    image: {
        id: Date.now() + Math.floor(Math.random() * 10),
        fileUrl: '',
        title: '',
        mediaType: 'image',
        description: '',
        fileFormat: '',
        fileSize: 0,
    }
}
export const FORM_COLUMN_TEMPLATE: FormTColumn = {
    id: Date.now() + Math.floor(Math.random() * 10),
    body: '',
    title: '',
    image: FORM_IMAGE()
}
export const PROPERTY_TEMPLATE: TProperty = {
    id: Date.now() + Math.floor(Math.random() * 10),
    attributes: [],
    image: {
        id: Date.now() + Math.floor(Math.random() * 10),
        fileUrl: '',
        title: '',
        mediaType: 'image',
        description: '',
        fileFormat: '',
        fileSize: 0,
    }
}


export const FEAT_TEMPLATE: TFeature = {
    id: Date.now() + Math.floor(Math.random() * 10),
    description: '',
    title: '',
    image: {
        id: Date.now() + Math.floor(Math.random() * 10),
        fileUrl: '',
        title: '',
        mediaType: 'image',
        description: '',
        fileFormat: '',
        fileSize: 0,
    }
}

export const FORM_FEAT_TEMPLATE: FormTFeature = {
    id: Date.now() + Math.floor(Math.random() * 10),
    description: '',
    title: '',
    image: FORM_IMAGE()
}
export const ATT_TEMPLATE: TAttribute = {
    id: Date.now() + Math.floor(Math.random() * 10),
    description: '',
    title: '',
}
export const TAG_TEMPLATE: TTag = {
    id: 0,
    code: '',
    name: ''
}
export const TAG_FORM_TEMPLATE: TTagForm = {
    code: '',
    id: 0,
    name: ''
}
export const FORM_NEWS_TEMPLATE: TNewsForm = {
    description: '',
    headline: '',
    lead: '',
    body: '',
    closure: '',
    mainImage: FORM_IMAGE(),
    images: [],
    videos: [],
    tags: [],
    draft: true,
    published: false,
    columns: []

}
export const FORM_TEASER_TEMPLATE: TTeaserForm = {
    name: '',
    headline: '',
    body: '',
    subHeadline: '',
    subBody: '',
    mainImage: FORM_IMAGE(),
    bodyImage: FORM_IMAGE(),
    segment: '',
    shape: '',
    launchDate: '',
    availableFrom: '',
    images: [],
    tags: [],
    draft: true,
    published: false,
    properties: [],
    closure:'',
    lead:'',
    description:'',

}
export const SERIE_TEMPLATE: TSerie = {
    id: Date.now() + Math.floor(Math.random() * 10),
    name: '',
    details: '',
    price: '',
    features: [],
    mainImage: {
        id: Date.now() + Math.floor(Math.random() * 10),
        fileUrl: '',
        title: '',
        mediaType: 'image',
        description: '',
        fileFormat: '',
        fileSize: 0,
    }
}

export const FORM_SERIE_TEMPLATE: FormTSerie = {
    id: Date.now() + Math.floor(Math.random() * 10),
    name: '',
    details: '',
    price: '',
    features: [],
    mainImage: FORM_IMAGE()
}

export const RELEASE_TEMPLATE: TReleaseForm = {
    headline: '',
    lead: '',
    body: '',
    images: [],
    name: '',
    tags: [],
    segment: '',
    shape: '',
    draft: true,
    published: false,
    extras: '',
    mainImage: FORM_IMAGE(),
    columns: [],
    series: [],
    features: [],
    qualities: []
}



export const STATIC_ICONS: string[] = [
    'caracteristica-1.svg',
    'caracteristica-2.svg',
    'caracteristica-3.svg',
    'caracteristica-4.svg',
]


