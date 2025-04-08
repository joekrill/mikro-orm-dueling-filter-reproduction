import {
  Entity,
  Filter,
  ManyToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/sqlite";
import { Newsletter } from "./Newsletter";

@Entity()
@Filter({
  name: "newsletterIssueUser",
  default: true,
  cond: ({ userId }) => ({
    newsletter: { memberships: { $some: { user: { id: userId } } } },
  }),
})
export class NewsletterIssue {
  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @ManyToOne(() => Newsletter)
  public newsletter!: Newsletter;
}
