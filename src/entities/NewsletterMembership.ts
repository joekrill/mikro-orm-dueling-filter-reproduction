import {
  Cascade,
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/sqlite";
import { Newsletter } from "./Newsletter";
import { User } from "./User";

@Entity()
export class NewsletterMembership {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => User, cascade: [Cascade.REMOVE, Cascade.REMOVE] })
  public user!: User;

  @ManyToOne(() => Newsletter)
  public newsletter!: Newsletter;
}
