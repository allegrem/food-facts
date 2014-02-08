class Product
  attr_accessor :id, :name, :cat

  def initialize(s)
    s = s.match /^(\d*),([^,]*),"?(.*)"?$/
    if s
      @id = s[1]
      @name = s[2]
      @cat = s[3].gsub('"','').gsub('n/a','')
    end
  end
end



class Category
  attr_accessor :name, :links, :count

  def initialize(name)
    @name = name
    @links = Hash.new
    @count = 1
  end

  def link(cat)
    if @links.has_key? cat
      @links[cat] += 1
    else
      @links[cat] = 1
    end
  end
end



# scan the file for products
products = Array.new
File.open("data-processed-cat.csv").each do |l|
  products << Product.new(l)
end



empty = 0
cats = Array.new

# scan categories for each product
products.each do |p|
  if !p.cat || p.cat == ''
    empty += 1

  else
    p_categories = []

    # scan all categories
    p.cat.scan(/[a-z]{2}:([-\w]*),?/).each do |c|
      c = c.first
      index = cats.index { |e| e.name == c }
      #increase category count if exists
      if index
        cats[index].count += 1
        p_categories << cats[index]
      #create category if doesn't exist
      else
        new_cat = Category.new(c)
        cats << new_cat
        p_categories << new_cat
      end
    end

    #create links between categories
    p_categories.each do |c|
      p_categories.each do |c2|
        c.link c2  if c != c2
      end
    end
  end
end


# sort
cats.sort! { |a,b| b.count <=> a.count }


# output csv
# puts '{'
# puts ' "nodes": ['
# cats.each do |c|
#   puts '  {'
#   puts '   "name": "'+c.name+'",'
#   puts '   "count": '+c.count.to_s+','
#   puts '   "links": ['
#   links_arr = []
#   c.links.each do |k,v|
#     links_arr << '    {"name": "'+k.name+'", "weight": '+v.to_s+'}'
#   end
#   puts links_arr.join(",\n")
#   puts '   ]'
#   puts '  }' + (c != cats.last ? ',' : '')
# end
# puts ' ]'
# puts '}'


# output links
puts '{'
puts ' "links": ['
s = []
cats.each do |c|
  c.links.each do |k,v|
    s << "  {\"source\":\"#{c.name}\", \"target\":\"#{k.name}\"}"
  end
end
puts s.join ",\n"
puts ' ]'
puts '}'



# Display some cool stats
# orphan_cats = 0
# average_links_nb = 0
# one_product_cats = 0

# cats.each do |c|
#   links_str = ''
#   c.links.each do |k,v| links_str << "#{k.name}:#{v} ; " end
#   puts c.name + ': ' + c.count.to_s + ' (' + links_str + ')'
  
#   if c.links.count == 0
#     orphan_cats += 1  
#   else
#     average_links_nb += c.links.count
#   end
#   one_product_cats += 1  if c.count == 1
# end

# puts '-----------------------'
# puts 'empty: ' + empty.to_s
# puts 'cats.length: ' + cats.length.to_s
# puts 'orphan_cats: ' + orphan_cats.to_s
# puts 'average_links_nb: ' + (average_links_nb / (2*(cats.length - orphan_cats))).to_s
# puts 'one_product_cats: ' + one_product_cats.to_s
