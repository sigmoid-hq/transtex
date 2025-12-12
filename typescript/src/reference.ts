export interface ReferenceInit {
    entryType: string;
    citeKey: string;
    title?: string;
    authors?: string[];
    journal?: string;
    booktitle?: string;
    publisher?: string;
    place?: string;
    institution?: string;
    edition?: string;
    month?: string;
    day?: string;
    editors?: string[];
    accessedDate?: string;
    medium?: string;
    year?: string;
    volume?: string;
    issue?: string;
    pages?: string;
    doi?: string;
    url?: string;
    extraFields?: Record<string, string>;
}

export class Reference {
    entryType: string;
    citeKey: string;
    title?: string;
    authors: string[];
    journal?: string;
    booktitle?: string;
    publisher?: string;
    place?: string;
    institution?: string;
    edition?: string;
    month?: string;
    day?: string;
    editors: string[];
    accessedDate?: string;
    medium?: string;
    year?: string;
    volume?: string;
    issue?: string;
    pages?: string;
    doi?: string;
    url?: string;
    extraFields: Record<string, string>;

    constructor(init: ReferenceInit) {
        this.entryType = init.entryType;
        this.citeKey = init.citeKey;
        this.title = init.title;
        this.authors = init.authors ?? [];
        this.journal = init.journal;
        this.booktitle = init.booktitle;
        this.publisher = init.publisher;
        this.place = init.place;
        this.institution = init.institution;
        this.edition = init.edition;
        this.month = init.month;
        this.day = init.day;
        this.editors = init.editors ?? [];
        this.accessedDate = init.accessedDate;
        this.medium = init.medium;
        this.year = init.year;
        this.volume = init.volume;
        this.issue = init.issue;
        this.pages = init.pages;
        this.doi = init.doi;
        this.url = init.url;
        this.extraFields = init.extraFields ?? {};
    }

    normalizedAuthors(): string[] {
        return this.authors.map((author) => author.trim()).filter(Boolean);
    }

    primaryContainer(): string | undefined {
        return this.journal ?? this.booktitle ?? this.publisher;
    }

    mergedFields(): Record<string, string> {
        const fields: Record<string, string> = {};
        if (this.normalizedAuthors().length > 0) {
            fields["author"] = this.normalizedAuthors().join(" and ");
        }
        if (this.title) fields["title"] = this.title;
        if (this.journal) fields["journal"] = this.journal;
        if (this.booktitle) fields["booktitle"] = this.booktitle;
        if (this.publisher) fields["publisher"] = this.publisher;
        if (this.place) fields["address"] = this.place;
        if (this.institution) fields["institution"] = this.institution;
        if (this.edition) fields["edition"] = this.edition;
        if (this.month) fields["month"] = this.month;
        if (this.day) fields["day"] = this.day;
        if (this.editors.length > 0) fields["editor"] = this.editors.join(" and ");
        if (this.accessedDate) fields["urldate"] = this.accessedDate;
        if (this.medium) fields["medium"] = this.medium;
        if (this.year) fields["year"] = this.year;
        if (this.volume) fields["volume"] = this.volume;
        if (this.issue) fields["number"] = this.issue;
        if (this.pages) fields["pages"] = this.pages;
        if (this.doi) fields["doi"] = this.doi;
        if (this.url) fields["url"] = this.url;

        for (const [key, value] of Object.entries(this.extraFields)) {
            if (!(key in fields)) {
                fields[key] = value;
            }
        }
        return fields;
    }
}
