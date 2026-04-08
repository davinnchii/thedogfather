        <div className="relative overflow-x-hidden md:overflow-visible">
          {/* Custom Prev Button */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="custom-swiper-button custom-swiper-button-prev"
            aria-label="Forrige lysbilde"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="testimonials-swiper-compact"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={testimonial.id}>
                <motion.div
                  initial={shouldReduceMotion ? {} : { scale: 0.98 }}
                  whileInView={shouldReduceMotion ? {} : { scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: shouldReduceMotion ? 0.15 : 0.3,
                    delay: shouldReduceMotion ? 0 : index * 0.03,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  style={{ willChange: "transform" }}
                  className="bg-surface-dark p-6 rounded-xl shadow-lg h-full flex flex-col border border-muted/30 hover:shadow-xl hover:bg-muted transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-primary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-white/90 leading-relaxed mb-4 flex-grow text-base">
                    &quot;{testimonial.content}&quot;
                  </p>
                  <div className="mt-auto pt-4 border-t border-muted/30">
                    <p className="font-semibold text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-white/70">{testimonial.role}</p>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Next Button */}
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="custom-swiper-button custom-swiper-button-next"
            aria-label="Neste lysbilde"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

