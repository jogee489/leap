#
# Factory for creating recipe objects.
#
Factory.define :recipe do |factory|
  factory.sequence(:title) { |n| "Recipe#{n}" }
  factory.ingredients
  factory.directions
end