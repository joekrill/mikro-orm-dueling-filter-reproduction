import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/sqlite";
import { OrganizationMembership } from "../../temp/temp2/OrganizationMembership";
import { Membership } from "../../temp/temp2/Membership";

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  @Property({ unique: true })
  email: string;

  @OneToMany({
    entity: () => Membership,
    mappedBy: "user",
    cascade: [Cascade.REMOVE, Cascade.REMOVE],
  })
  memberships = new Collection<Membership>(this);

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}
