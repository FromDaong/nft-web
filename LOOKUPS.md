Lookup nftLikes

```
{
  from: 'nftLikes',
  startWith: "$id",
  connectFromField: 'id',
  connectToField: 'nftId',
  as: 'likes',
}
```

Lookup followers to profile

```
{
  from: 'followRelationships',
  startWith: "$username",
  connectFromField: 'username',
  connectToField: 'follows',
  as: 'followers',
}
```

Lookup subscribers to profile

```
{
  from: 'subscriptionRelationships',
  startWith: "$username",
  connectFromField: 'username',
  connectToField: 'subscribedTo',
  as: 'followers',
}
```
