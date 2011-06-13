DEV_JS_CSS_SOURCES = $(shell find ./http-pub -name "*.js" -o -name "*.css")

# Make a production build (includes a development build) if make is run without arguments.
default: http-pub-production

LABELS = \
	--label arbor=http-pub/3rdparty/arbor
#
# Development version:
#
DEVELOPMENT_TARGETS = http-pub/index.html

.PHONY: development
development: ${DEVELOPMENT_TARGETS}

http-pub/%.html: http-pub/%.html.template ${DEV_JS_CSS_SOURCES}
	buildDevelopment \
		--cssimports \
		--root=http-pub \
		${LABELS} \
		$<

#
# Production version (built from the development version):
#
http-pub-production: ${DEVELOPMENT_TARGETS}
	-rm -fr http-pub-production
	buildProduction \
		--root http-pub \
		--outroot http-pub-production \
		${LABELS} \
		http-pub/index.html
	touch http-pub-production

.PHONY: clean
clean:
	-rm -fr http-pub-production ${DEVELOPMENT_TARGETS}
