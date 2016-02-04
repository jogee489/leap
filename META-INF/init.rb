WARBLER_CONFIG = {"public.root"=>"/", "rails.env"=>"production"}

if $servlet_context.nil?
  ENV['GEM_HOME'] = File.expand_path(File.join('..', '..', '/WEB-INF/gems'), __FILE__)

  ENV['BUNDLE_GEMFILE'] ||= File.expand_path(File.join('..', '..', 'WEB-INF/Gemfile'), __FILE__)

else
  ENV['GEM_HOME'] = $servlet_context.getRealPath('/WEB-INF/gems')

  ENV['BUNDLE_GEMFILE'] ||= $servlet_context.getRealPath('/WEB-INF/Gemfile')

end
ENV['RAILS_ENV'] ||= 'production'
ENV['BUNDLE_WITHOUT'] = 'development:test:assets'

