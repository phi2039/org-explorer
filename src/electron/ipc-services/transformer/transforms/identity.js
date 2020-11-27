const identity = data => data;

const IdentityTransform = () => ({
  parse: identity,
  dump: identity,
  probe: () => true,
});

module.exports = IdentityTransform;
