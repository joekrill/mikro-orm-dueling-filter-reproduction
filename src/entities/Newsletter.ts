import {
  Collection,
  Entity,
  Filter,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/sqlite";
import { NewsletterMembership } from "./NewsletterMembership";
import { NewsletterIssue } from "./NewsletterIssue";

@Entity()
@Filter({
  name: "newsletterUser",
  default: true,
  cond: ({ userId }) => ({ memberships: { $some: { user: { id: userId } } } }),
})
export class Newsletter {
  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  @OneToMany({ entity: () => NewsletterIssue, mappedBy: "newsletter" })
  public issues = new Collection<NewsletterIssue>(this);

  @OneToMany({
    entity: () => NewsletterMembership,
    mappedBy: "newsletter",
  })
  memberships = new Collection<NewsletterMembership>(this);

  constructor(name: string) {
    this.name = name;
  }
}
